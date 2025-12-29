import dbClient from '../db/connectionDB'

export class ProjectService {
  async createProject(data: { name: string; description?: string; isActive?: boolean }) {
    const query = `
      INSERT INTO projects (name, description, is_active)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const result = await dbClient.query(query, [data.name, data.description || null, data.isActive ?? true])
    return result.rows[0]
  }

  async getProjectById(id: number) {
    const query = 'SELECT * FROM projects WHERE id = $1'
    const result = await dbClient.query(query, [id])
    return result.rows[0] || null
  }

  async getAllProjects() {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC'
    const result = await dbClient.query(query)
    return result.rows
  }

  async updateProject(id: number, data: { name?: string; description?: string; isActive?: boolean }) {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(data.name)
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`)
      values.push(data.description)
    }

    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`)
      values.push(data.isActive)
    }

    if (updates.length === 0) {
      return null
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE projects
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await dbClient.query(query, values)
    return result.rows[0] || null
  }

  async deleteProject(id: number) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *'
    const result = await dbClient.query(query, [id])
    return result.rows[0] || null
  }
}

export const projectService = new ProjectService()
