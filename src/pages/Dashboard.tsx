import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, Message } from '../services/api'

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sender, setSender] = useState('')
  
  // قراءة المعلم من الرابط لفحص الخصوصية
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('view') === 'admin'

  useEffect(() => {
    // نجلب الرسائل فقط إذا كان الداخل هو صاحب الحساب
    if (isAdmin) {
      fetchMessages()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !sender.trim()) return

    try {
      await api.createMessage(newMessage, sender)
      setNewMessage('')
      setSender('')
      setShowModal(false)
      alert('تم إرسال رسالتك المجهولة بنجاح! 🚀')
      if (isAdmin) fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleLike = async (id: number) => {
    try {
      const updatedMessage = await api.likeMessage(id)
      setMessages(messages.map(msg => msg.id === id ? updatedMessage : msg))
    } catch (error) {
      console.error('Error liking message:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const getAvatarColor = (sender: string) => {
    const colors = ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-pink-100 text-pink-600']
    const index = sender.charCodeAt(0) % colors.length
    return colors[index]
  }

  // --- 1. واجهة الزائر (إرسال رسالة فقط) ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-purple-100/50 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-600 text-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-md mb-3">
              M
            </div>
            <h2 className="text-2xl font-bold text-gray-800">أرسل رسالة مجهولة</h2>
            <p className="text-sm text-gray-500 mt-1">لن يعرف أحد هويتك، قل ما بخاطرك بصراحة</p>
          </div>
          
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حرف من اسمك (للأفاتار)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                maxLength={1}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center font-bold uppercase"
                placeholder="A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة السرية</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="اكتب رسالتك السرية هنا..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>🚀</span> إرسال الصراحة الآن
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- 2. لوحة التحكم الخاصة بك (عند وجود view=admin?) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Anonymous Messages 🔐 (Admin)</h1>
            </div>
            <div className="flex items-center">
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Message Cards */}
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(message.sender)}`}>
                    <span className="font-semibold">{message.sender}</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatTimestamp(message.timestamp)}</span>
                </div>
                <p className="text-gray-700 mb-4">{message.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(message.id)}
                    className="mr-4 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <span>❤️</span>
                    <span>{message.likes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{message.replies}</span>
                  </span >
                </div>
              </div>
            ))}

            {/* New Message Card */}
            <div
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-center h-full min-h-[150px]">
                <div className="text-center text-white">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="font-semibold">Test Send Message</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Send Message Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Send Anonymous Message</h2>
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Initial</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  maxLength={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="A"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your anonymous message..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard