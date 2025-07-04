import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {setPost(post);
                     console.log(appwriteService.getFilePreview(post.featuredImage))
                               }else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        // this is allowing any user to delete post of any user
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };
    
    const directToEdit =()=>{
        // console.log(slug)
    
        navigate("/edit-post/"+slug)
    }

    
    
    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    
                    <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} 
                // <img src={"https://fra.cloud.appwrite.io/v1/storage/buckets/684d20d9002280e4678d/files/685269f49077fcc8e074/view?project=684d1d83002a58f7d6f5&mode=admin"} alt={title}
                className='rounded-xl' />
                   
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                    </div>

            </Container>
                <div>    

                    {isAuthor && (
                        <div className=" right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}</div>
        </div>
    ) : null;
}
