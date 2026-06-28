import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { useSelector } from "react-redux";

function Home() {
    const [posts, setPosts] = useState([])
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    const handleLikeToggle = async (postId) => {
        try {
            const updatedPost = await appwriteService.toggleLikePost(postId);
            setPosts((currentPosts) =>
                currentPosts.map((post) => (post.$id === postId ? updatedPost : post))
            );
        } catch (error) {
            console.log("Failed to toggle like", error);
        }
    };
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold text-lavender-purple-100 hover:text-mauve-magic-200">
                                Login to read posts
                                {/* here improvement needed when posts are zero then also it shows that login to read posts 
                                also when u logout , posts are still visible
                                this accepts randow emails also , do something system of OTP etc for that means that should be a valid email*/}
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <header className="mb-8 border-b border-lavender-purple-800/50 pb-6">
                    <p className="text-sm font-medium uppercase tracking-widest text-mauve-magic-300">
                        Welcome to MOOI
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-lavender-purple-50 sm:text-3xl">
                        Good to see you, {userData?.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-lavender-purple-200 sm:text-base">
                        Explore stories, ideas, and conversations from the MOOI community.
                    </p>
                </header>
                <div className='flex flex-wrap -mx-2'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} onLikeToggle={handleLikeToggle} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
