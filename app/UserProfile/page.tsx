"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const page = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")

  const [user, setUser] = useState<any>()

  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setFullName(user.user_metadata.full_name || "")
      }
    }
    loadUser()
  }
    , [])

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    })
    if (!error) {
      setUser((prevUser: any) => ({
        ...prevUser,
        user_metadata: {
          ...prevUser.user_metadata,
          full_name: fullName,
        }
      }))

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (!user) return
    setFullName(user.user_metadata.full_name || "")
    setIsEditing(false);
  }

  return (
    <div className='h-full max-w-8xl mx-auto mt-24  text-white flex-wrap items-center justify-center px-4 md:px-12'>

      <div className="px-16 py-2 mb-6 ">
        <h1 className="text-3xl  font-semibold">
          My Account
        </h1>
      </div>
      <div className="px-16">
        {user && (
          <div className='flex flex-row gap-4 items-start w-full bg-neutral-800 px-8 py-8 rounded-2xl'>
            <img
              src={user.user_metadata.avatar_url}
              alt="User"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className='text-2xl font-semibold text-neutral-300'>
                {user.user_metadata.full_name}
              </h1>
              <p className='text-sm text-neutral-300 '>
                Not a member yet
              </p>
            </div>

          </div>
        )}
      </div>

      <div className='px-16 py-8 mt-4'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-2xl font-semibold'>Personal Details</h1>
          {isEditing ? (
            <div className='flex flex-row gap-2'>
              <button
                onClick={handleSave}
                className="bg-white text-black px-2 py-1 rounded cursor-pointer"
              >
                Save Changes
              </button>
              <button className="bg-neutral-800 px-2 py-1 rounded cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-neutral-800 px-2 py-1 rounded cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className='py-6'>
          {user && (
            <div>
              <h1>User Name</h1>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={32}
                disabled={!isEditing}
                className='bg-neutral-800 mt-2 px-2 py-1 rounded' />
            </div>
          )}
        </div>
        <div className='py-6'>
          {user && (
            <div>
              <h1>Email</h1>
              <input type="text" value={user.email} className='bg-neutral-800 w-96 mt-2 px-2 py-1 rounded' disabled />
            </div>
          )}
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/")
          }}
          className="text-neutral-800 mt-6 bg-neutral-100 hover:bg-neutral-300 transition-all  font-semibol rounded px-3 py-2 text-xl cursor-pointer"
        >
          Logout of CineZest
        </button>

      </div>

    </div>
  )
}

export default page