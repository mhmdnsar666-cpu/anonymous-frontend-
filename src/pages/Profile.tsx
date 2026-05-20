import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, User } from '../services/api'

function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: ''
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await api.getUser()
      setUser(data)
      setEditForm({
        displayName: data.displayName,
        bio: data.bio
      })
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const updatedUser = await api.updateUser({
        displayName: editForm.displayName,
        bio: editForm.bio
      })
      setUser(updatedUser)
      setEditing(false)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleSettingChange = async (setting: keyof User, value: boolean) => {
    if (!user) return

    try {
      const updatedUser = await api.updateUser({ [setting]: value })
      setUser(updatedUser)
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  const handleCopyLink = () => {
    const link = `https://anonmsg.com/u/${user?.username}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Anonymous Messages</h1>
            </div>
            <div className="flex items-center">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-16 sm:-mt-12">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-5xl">👤</span>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-2">
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-purple-500 focus:outline-none w-full sm:w-auto"
                    />
                    <p className="text-gray-600">@{user.username}</p>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={2}
                      className="mt-2 text-gray-700 border-b-2 border-purple-500 focus:outline-none w-full resize-none"
                    />
                    <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false)
                          setEditForm({
                            displayName: user.displayName,
                            bio: user.bio
                          })
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
                    <p className="text-gray-600">@{user.username}</p>
                    <p className="mt-2 text-gray-700">{user.bio}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">{user.messageCount}</p>
                <p className="text-sm text-gray-600">Messages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{user.likeCount}</p>
                <p className="text-sm text-gray-600">Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{user.replyCount}</p>
                <p className="text-sm text-gray-600">Replies</p>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900 mb-3">Share Your Profile</h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`https://anonmsg.com/u/${user.username}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Allow anonymous messages</span>
                <input
                  type="checkbox"
                  checked={user.allowMessages}
                  onChange={(e) => handleSettingChange('allowMessages', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Show message timestamps</span>
                <input
                  type="checkbox"
                  checked={user.showTimestamps}
                  onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Enable notifications</span>
                <input
                  type="checkbox"
                  checked={user.enableNotifications}
                  onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
