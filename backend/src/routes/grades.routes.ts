import { Router } from 'express';
import {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  getStatistics,
} from '../controllers/grades.controller';
import { authenticateToken } from '../utils/jwt';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

router.post('/', createGrade);
router.get('/', getAllGrades);
router.get('/statistics', getStatistics);
router.get('/:id', getGradeById);
router.put('/:id', updateGrade);
router.delete('/:id', deleteGrade);

export default router;
