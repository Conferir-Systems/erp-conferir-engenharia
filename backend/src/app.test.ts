import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './app'

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('environment')
    })

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/health')

      const timestamp = new Date(response.body.timestamp)
      expect(timestamp.toString()).not.toBe('Invalid Date')
    })
  })

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty(
        'message',
        'Construction Manager API'
      )
      expect(response.body).toHaveProperty('version', '1.0.0')
      expect(response.body).toHaveProperty('endpoints')
    })

    it('should return correct endpoints', async () => {
      const response = await request(app).get('/api')

      expect(response.body.endpoints).toEqual({
        health: '/health',
        api: '/api',
      })
    })
  })

  describe('GET /non-existent-route', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Not Found')
      expect(response.body.message).toContain(
        'GET /non-existent-route not found'
      )
    })
  })

  describe('POST /api', () => {
    it('should handle POST requests correctly', async () => {
      const response = await request(app).post('/api').send({ test: 'data' })

      expect(response.status).toBe(404)
      expect(response.body.message).toContain('POST /api not found')
    })
  })
})
