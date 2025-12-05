import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all backlog items
export async function getBacklogItems(sprintId?: number) {
  try {
    if (sprintId) {
      // Get backlog items for a specific sprint
      return await prisma.backlogItem.findMany({
        where: { sprintId },
        orderBy: { id: 'desc' },
      });
    }
    // Get all unassigned backlog items (backlog)
    return await prisma.backlogItem.findMany({
      where: { sprintId: null },
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching backlog items:', error);
    throw new Error('Failed to fetch backlog items');
  }
}

// Get backlog item by ID
export async function getBacklogItemById(id: number) {
  try {
    return await prisma.backlogItem.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching backlog item:', error);
    throw new Error('Failed to fetch backlog item');
  }
}

// Create a new backlog item
export async function createBacklogItem(data: {
  title: string;
  description?: string;
  sprintId?: number;
  storyPoints?: number;
  priority?: string;
  status?: string;
  assignee?: string;
  tags?: string[];
}) {
  try {
    // Validate that sprint exists if sprintId is provided
    if (data.sprintId) {
      const sprint = await prisma.sprint.findUnique({
        where: { id: data.sprintId },
      });
      if (!sprint) {
        throw new Error('Sprint not found');
      }
    }

    return await prisma.backlogItem.create({
      data: {
        title: data.title,
        description: data.description || null,
        sprintId: data.sprintId || null,
        completed: false,
        storyPoints: data.storyPoints || 0,
        priority: data.priority || 'medium',
        status: data.status || 'todo',
        assignee: data.assignee || null,
        tags: data.tags || [],
      },
    });
  } catch (error) {
    console.error('Error creating backlog item:', error);
    throw error;
  }
}

// Update backlog item
export async function updateBacklogItem(
  id: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
    sprintId?: number | null;
    storyPoints?: number;
    priority?: string;
    status?: string;
    assignee?: string;
    tags?: string[];
  }
) {
  try {
    // Check if item exists
    const item = await prisma.backlogItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new Error('Backlog item not found');
    }

    // Validate sprint if updating sprintId
    if (data.sprintId) {
      const sprint = await prisma.sprint.findUnique({
        where: { id: data.sprintId },
      });
      if (!sprint) {
        throw new Error('Sprint not found');
      }
    }

    return await prisma.backlogItem.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.sprintId !== undefined && { sprintId: data.sprintId }),
        ...(data.storyPoints !== undefined && { storyPoints: data.storyPoints }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.assignee !== undefined && { assignee: data.assignee }),
        ...(data.tags !== undefined && { tags: data.tags }),
      },
    });
  } catch (error) {
    console.error('Error updating backlog item:', error);
    throw error;
  }
}

// Delete backlog item
export async function deleteBacklogItem(id: number) {
  try {
    const item = await prisma.backlogItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new Error('Backlog item not found');
    }

    return await prisma.backlogItem.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting backlog item:', error);
    throw error;
  }
}

// Move backlog item to sprint
export async function moveToSprint(id: number, sprintId: number) {
  try {
    const item = await prisma.backlogItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new Error('Backlog item not found');
    }

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });
    if (!sprint) {
      throw new Error('Sprint not found');
    }

    return await prisma.backlogItem.update({
      where: { id },
      data: { sprintId },
    });
  } catch (error) {
    console.error('Error moving backlog item to sprint:', error);
    throw error;
  }
}

// Get backlog statistics
export async function getBacklogStats() {
  try {
    const total = await prisma.backlogItem.count();
    const completed = await prisma.backlogItem.count({
      where: { completed: true },
    });
    const inProgress = await prisma.backlogItem.count({
      where: { completed: false, sprintId: { not: null } },
    });
    const pending = await prisma.backlogItem.count({
      where: { completed: false, sprintId: null },
    });

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  } catch (error) {
    console.error('Error fetching backlog stats:', error);
    throw error;
  }
}
