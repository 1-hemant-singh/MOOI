import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'
import IconActionButton from './IconActionButton'

function PostCard({$id, title, featuredImage, authorName, likesCount = 0, isLiked = false, onLikeToggle}) {
  return (
        <div className='w-full h-full flex flex-col justify-between rounded-2xl border border-lavender-purple-800/60 bg-indigo-ink-900/80 p-4 shadow-xl shadow-dark-amethyst-950/40 transition hover:-translate-y-1 hover:border-mauve-magic-500/70'>
            <Link to={`/post/${$id}`}>
            <div className='w-full justify-center mb-4 overflow-hidden rounded-xl'>
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title} 
                className='w-full rounded-xl object-cover' />

            </div>
            <h2
            className='text-xl font-bold text-lavender-purple-50'
            >{title}</h2>
            <p className='mt-2 text-sm text-lavender-purple-200'>By {authorName || "Unknown author"}</p>
            </Link>
            <div className='mt-4 flex items-center justify-between gap-2 border-t border-lavender-purple-800/40 pt-3'>
                <span className='text-sm text-lavender-purple-300'>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
                {onLikeToggle ? (
                    <IconActionButton
                        variant="like"
                        active={isLiked}
                        label={isLiked ? "Unlike" : "Like"}
                        iconSize="w-5 h-5"
                        className="px-2 py-1.5"
                        onClick={() => onLikeToggle($id)}
                    />
                ) : null}
            </div>
        </div>
  )
}


export default PostCard
