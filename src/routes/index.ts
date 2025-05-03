import { Router } from 'express';
// import authRoutes from './authRoutes';
// import userRoutes from './userRoutes';
// import taskRoutes from './taskRoutes';

const router = Router();

router.use('/auth', authRoutes); 
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
// router.use('/classes', classRoutes);
// router.use('/events', eventRoutes);
// router.use('/grades', gradeRoutes);
// router.use('/homework', homeworkRoutes);


export default router;