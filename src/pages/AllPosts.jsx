import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
// import LogoutBtn from '../components/Header/LogoutBtn';
import { useSelector } from "react-redux";


function AllPosts() {
    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([])
    useEffect(() => {
         appwriteService.getPosts([]).then((posts) => {
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
    }
   
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => {
                   
                       const isAuthor = post && userData ? post.userid === userData.$id : false;


                    return isAuthor&&(<div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post} onLikeToggle={handleLikeToggle} />
                    </div>)
                }
                    
                )}
            </div>
            </Container>
    </div>
  )
}

export default AllPosts
