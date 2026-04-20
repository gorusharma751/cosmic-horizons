import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

export function setupSocketHandlers(io: Server) {
  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication required'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cosmic-secret-key') as any
      socket.data.userId = decoded.userId
      socket.data.role = decoded.role
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    const { userId, role } = socket.data
    console.log(`User connected: ${userId} (${role})`)

    // Join personal room
    socket.join(`user_${userId}`)

    // Pandit joins their room
    if (role === 'PANDIT') {
      socket.on('pandit_register', ({ panditId }) => {
        socket.join(`pandit_${panditId}`)
        socket.data.panditId = panditId
        console.log(`Pandit ${panditId} registered`)
      })
    }

    // Join consultation room
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId)
      socket.to(roomId).emit('user_joined', { userId })
      console.log(`User ${userId} joined room ${roomId}`)
    })

    // Leave room
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId)
      socket.to(roomId).emit('user_left', { userId })
    })

    // Chat message
    socket.on('send_message', ({ roomId, message, consultationId }) => {
      io.to(roomId).emit('new_message', {
        id: Date.now().toString(),
        senderId: userId,
        message,
        consultationId,
        createdAt: new Date().toISOString()
      })
    })

    // WebRTC signaling for video/voice calls
    socket.on('webrtc_offer', ({ roomId, offer, targetUserId }) => {
      socket.to(roomId).emit('webrtc_offer', { offer, fromUserId: userId })
    })

    socket.on('webrtc_answer', ({ roomId, answer }) => {
      socket.to(roomId).emit('webrtc_answer', { answer, fromUserId: userId })
    })

    socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('webrtc_ice_candidate', { candidate, fromUserId: userId })
    })

    socket.on('call_ended', ({ roomId }) => {
      socket.to(roomId).emit('call_ended', { fromUserId: userId })
    })

    // Typing indicator
    socket.on('typing_start', ({ roomId }) => {
      socket.to(roomId).emit('typing_start', { userId })
    })

    socket.on('typing_stop', ({ roomId }) => {
      socket.to(roomId).emit('typing_stop', { userId })
    })

    // Live stream events
    socket.on('join_live', ({ panditId }) => {
      socket.join(`live_${panditId}`)
      // Update viewer count
      const room = io.sockets.adapter.rooms.get(`live_${panditId}`)
      const viewerCount = room ? room.size : 0
      io.to(`live_${panditId}`).emit('viewer_update', { viewerCount })
    })

    socket.on('leave_live', ({ panditId }) => {
      socket.leave(`live_${panditId}`)
      const room = io.sockets.adapter.rooms.get(`live_${panditId}`)
      const viewerCount = room ? room.size : 0
      io.to(`live_${panditId}`).emit('viewer_update', { viewerCount })
    })

    socket.on('live_message', ({ panditId, message }) => {
      io.to(`live_${panditId}`).emit('live_message', {
        userId, message,
        createdAt: new Date().toISOString()
      })
    })

    socket.on('send_gift', ({ panditId, giftType, giftValue }) => {
      io.to(`live_${panditId}`).emit('gift_received', {
        fromUserId: userId, giftType, giftValue,
        createdAt: new Date().toISOString()
      })
    })

    // Pandit online status
    socket.on('set_online', ({ isOnline }) => {
      socket.broadcast.emit('pandit_status_change', {
        panditId: socket.data.panditId,
        isOnline
      })
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`)
      if (socket.data.panditId) {
        io.emit('pandit_status_change', { panditId: socket.data.panditId, isOnline: false })
      }
    })
  })
}
