import Project from '../models/project.js';
import { validationResult } from 'express-validator';

const projectController = {
  async getAll(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const userId = req.user?.id;
      const projects = await Project.getAll(userId);

      res.json({
        success: true,
        message: 'Projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving projects',
        error: error.message
      });
    }
  },

  async getMyProjects(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const projects = await Project.getUserProjects(req.user.id);

      res.json({
        success: true,
        message: 'User projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getMyProjects:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user projects',
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const project = await Project.getById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (req.user && req.user.id !== project.user_id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this project'
        });
      }

      res.json({
        success: true,
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving project',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const payload = {
        ...req.body,
        image: req.body.image || null,
        github_link: req.body.github_link || null,
        demo_link: req.body.demo_link || null,
        user_id: req.user.id
      };

      const project = await Project.create(payload);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;

      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this project'
        });
      }

      const payload = {
        ...req.body,
        image: req.body.image || null,
        github_link: req.body.github_link || null,
        demo_link: req.body.demo_link || null
      };

      const project = await Project.update(id, payload);

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  },

  async softDelete(req, res) {
    try {
      // console.log('=== DEBUG: Soft Delete Attempt ===');
      // console.log('Authenticated User:', req.user);

      const { id } = req.params;
      // console.log('Project ID to delete:', id);

      const existingProject = await Project.getById(id);

      if (!existingProject) {
        console.log('Project not found');
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.deleted_at) {
        return res.status(400).json({
          success: false,
          message: 'Project is already deleted'
        });
      }

      // console.log('Comparing:');
      // console.log('Request User ID:', req.user.id, typeof req.user.id);
      // console.log('Project User ID:', existingProject.user_id, typeof existingProject.user_id);

      if (String(existingProject.user_id) !== String(req.user.id)) {
        console.log('Authorization failed - user IDs do not match');
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this project'
        });
      }

      const project = await Project.softDelete(id);

      console.log('Soft delete successful');
      res.json({
        success: true,
        message: 'Project soft-deleted successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in softDelete:', error);
      res.status(500).json({
        success: false,
        message: 'Error soft-deleting project',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async restore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;
      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to restore this project'
        });
      }

      const project = await Project.restore(id);

      res.json({
        success: true,
        message: 'Project restored successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in restore:', error);
      res.status(500).json({
        success: false,
        message: 'Error restoring project',
        error: error.message
      });
    }
  },

  async hardDelete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;

      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to permanently delete this project'
        });
      }

      const project = await Project.hardDelete(id);

      res.json({
        success: true,
        message: 'Project permanently deleted',
        data: project
      });
    } catch (error) {
      console.error('Error in hardDelete:', error);
      res.status(500).json({
        success: false,
        message: 'Error permanently deleting project',
        error: error.message
      });
    }
  },

  async getDeleted(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const projects = await Project.getDeleted(req.user.id);

      res.json({
        success: true,
        message: 'Deleted projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getDeleted:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving deleted projects',
        error: error.message
      });
    }
  }
};

export default projectController;