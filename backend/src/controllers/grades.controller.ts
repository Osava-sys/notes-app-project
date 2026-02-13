import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../utils/jwt';
import { createGradeSchema, updateGradeSchema } from '../validators/schemas';

export const createGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createGradeSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const grade = await prisma.grade.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    res.status(201).json({
      message: 'Grade created successfully',
      grade,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const grades = await prisma.grade.findMany({
      where: { userId },
      orderBy: [{ semester: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({
      grades,
      count: grades.length,
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGradeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const grade = await prisma.grade.findFirst({
      where: { id, userId },
    });

    if (!grade) {
      res.status(404).json({ error: 'Grade not found' });
      return;
    }

    res.json({ grade });
  } catch (error) {
    console.error('Get grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const validatedData = updateGradeSchema.parse(req.body);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingGrade = await prisma.grade.findFirst({
      where: { id, userId },
    });

    if (!existingGrade) {
      res.status(404).json({ error: 'Grade not found' });
      return;
    }

    const grade = await prisma.grade.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      message: 'Grade updated successfully',
      grade,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingGrade = await prisma.grade.findFirst({
      where: { id, userId },
    });

    if (!existingGrade) {
      res.status(404).json({ error: 'Grade not found' });
      return;
    }

    await prisma.grade.delete({
      where: { id },
    });

    res.json({
      message: 'Grade deleted successfully',
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const grades = await prisma.grade.findMany({
      where: { userId },
    });

    if (grades.length === 0) {
      res.json({
        overallAverage: 0,
        semesterAverages: [],
        totalGrades: 0,
      });
      return;
    }

    // Calcul de la moyenne générale
    const overallAverage =
      grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;

    // Calcul des moyennes par semestre
    const semesterGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.semester]) {
        acc[grade.semester] = [];
      }
      acc[grade.semester].push(grade.score);
      return acc;
    }, {} as Record<number, number[]>);

    const semesterAverages = Object.entries(semesterGroups).map(([semester, scores]) => ({
      semester: parseInt(semester),
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      gradeCount: scores.length,
    }));

    res.json({
      overallAverage: Math.round(overallAverage * 100) / 100,
      semesterAverages: semesterAverages.sort((a, b) => a.semester - b.semester),
      totalGrades: grades.length,
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
