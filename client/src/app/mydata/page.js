'use client'

import { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

const getUserInitials = (name) => {
    if (!name || typeof name !== "string") return "U";  // Prevents errors
    const words = name.trim().split(" ");
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase(); // First letters of first & last name
    }
    return words[0].substring(0, 2).toUpperCase(); // First 2 letters if only one name
};
export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [uploading, setUploading] = useState(false)
    const [profileImage, setProfileImage] = useState(null);
    const [initials, setInitials] = useState("");
    const fileInputRef = useRef(null) // ✅ create ref

    useEffect(() => {
        if (user) {
            setProfileImage(user?.profilePicture?.url || user?.profileImageURL);
            setInitials(getUserInitials(user?.username));
        }
    }, [user]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/users/me?depth=1')
            const data = await res.json()
            setUser(data)
            setName(data.username || '')
            setEmail(data.email)
        }

        fetchUser()
    }, [])

    const handleChooseFile = () => {
        fileInputRef.current?.click() // ✅ trigger hidden file input
    }

    const handleAvatarUpload = async (file) => {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        const token = localStorage.getItem('authToken') // 🔐 get JWT from localStorage

        try {
            const mediaRes = await axios.post('/api/media', formData, {
                headers: {
                    'Authorization': `JWT ${token}`, // ✅ Payload expects this format
                },
            })

            const mediaId = mediaRes.data.id

            await axios.patch(`/api/users/${user.id}`, {
                profilePicture: mediaId,
            }, {
                headers: {
                'Authorization': `JWT ${token}`, // ✅ required again
                },
            })
            alert('Avatar uploaded successfully')
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Upload failed: ' + error?.response?.data?.error || 'Unknown error')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        await axios.patch(`/api/users/${user.id}`, {
        username: name,
        email,
        })
        alert('Saved!')
    }

    const handlePasswordChange = async () => {
        const newPass = prompt('Enter new password:')
        if (!newPass) return
        await axios.post(`/api/users/${user.id}/change-password`, { newPassword: newPass })
        alert('Password updated')
    }

    const handleEnable2FA = async () => {
        await axios.post(`/api/users/${user.id}/enable-2fa`)
        alert('2FA enabled (stub)')
    }

    if (!user) return <div className="p-10">Loading...</div>

    return (
        <div className="p-6 space-y-10">
            {/* Profile Info */}
            <div className="bg-white px-6 py-4 shadow rounded-xl w-4/5 mx-auto">
                <h2 className="text-lg font-bold mb-3 text-gray-600">Your Information</h2>
                <hr className='mb-3 mt-8 text-gray-300'/>
                <div className="w-full space-y-6">
                    <div className='w-full space-y-2'>
                        <div className="text-gray-600">Name*</div>
                        <input
                            className="border px-4 py-2 rounded-xl text-gray-600 w-full focus:outline-none focus:ring-1 focus:ring-[#9770C8] border-gray-300"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='w-full space-y-2'>
                        <div className="text-gray-600">Email*</div>
                        <input
                            className="border px-4 py-2 rounded-xl text-gray-600 w-full focus:outline-none focus:ring-1 focus:ring-[#9770C8] border-gray-300"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <button onClick={handleSave} className=" bg-[#41388C] hover:bg-[#2f2c45] text-white px-4 py-1.5 rounded-lg cursor-pointer">
                        Save
                    </button>
                </div>

            </div>

            {/* Avatar Upload */}
            <div className="bg-white px-6 py-4 shadow rounded-xl w-4/5 mx-auto">
                <h2 className="text-lg font-bold mb-3 text-gray-600">Update Your Avatar</h2>
                <hr className='mb-3 mt-8 text-gray-300'/>
                <div className="flex items-center gap-4 mt-6">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt={user?.username || "User Profile"}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white px-6 py-8 bg-[#279AAC] rounded-full text-4xl">{initials}</span>
                    )}
                    <div className='text-gray-600 text-xl'>
                        We display avatars associated with your email via Gravatar. To update your avatar, please visit Gravatar.
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleChooseFile}
                        className="bg-[#41388C] hover:bg-[#2f2c45] text-white px-4 py-1.5 rounded-xl"
                    >
                        {uploading ? "Uploading..." : "Upload New Avatar"}
                    </button>
                </div>
            </div>

            {/* Password */}
            <div className="bg-white px-6 py-4 shadow rounded-xl w-4/5 mx-auto">
                <h2 className="text-lg font-bold mb-3 text-gray-600">Change Your Password</h2>
                <hr className='mb-3 mt-8 text-gray-300'/>
                <p className="text-xl text-gray-500 mt-6">
                    You can update your password to enhance the security of your account. It&apos;s important to choose a strong, unique password that protects your personal information. Make sure to select a password that you haven&apos;t used before and avoid easily guessable combinations.
                </p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handlePasswordChange}
                        className="mt-3 bg-[#41388C] hover:bg-[#2f2c45] text-white px-4 py-1.5 rounded-xl">
                    Change Password
                    </button>
                </div>
            </div>
        </div>
    )
}
