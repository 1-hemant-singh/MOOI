import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import authService from '../appwrite/auth';

function Home() {
    const [posts, setPosts] = useState([])
    const [name,setName]=useState("");

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
        authService.getCurrentUser().then((user)=>{
              if (user) {
        console.log("User name:", user.name);
        setName(user.name); // or setEmail(user.email), etc.
      }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
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
                <div className='pb-9'> Hello <strong>{name}</strong>!! welcome to our website </div>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home