import React, {useState, useEffect} from "react";
import { useOutletContext } from 'react-router-dom';
import './BlogPage.css';

const postModules = import.meta.glob('../../content/blog/*/index.md', { eager: true });
const imageModules = import.meta.glob('../../content/blog/*/images/*', { eager: true, as: 'url' });

function BlogPage() {
    const { setTopbox } = useOutletContext();
    useEffect(() => {
        setTopbox(<></>);
    }, [setTopbox]);

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const imagesByPost = {};
    Object.entries(imageModules).forEach(([path, url]) => {
    // Extract the post folder name (e.g., "2025-07-01-my-post")
        const match = path.match(/blog\/([^/]+)\/images\//);
        if (match) {
            const folder = match[1];
            if (!imagesByPost[folder]) imagesByPost[folder] = [];
            imagesByPost[folder].push(url);
        }
    });

    // Convert the imported modules to an array of post objects
    const blogPosts = Object.entries(postModules)
        .filter(([path]) => !path.includes('/_drafts/'))
        .map(([path, mod]) => {
        // Get the folder name as the slug (e.g., "2025-06-30-my-post")
        const folder = path.split('/').slice(-2, -1)[0];
        return {
            ...mod.attributes,
            slug: folder,
            content: mod.html,
            images: imagesByPost[folder] || [],
        };
    });

    

    // Sort by date descending (if you want)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="blog">
            <ul className="blog-list">
                {blogPosts.map(post => (
                    <li key={post.slug} className="blog-preview">
                        <button onClick={() => { setSelectedPost(post); setShowModal(true); }}>
                            <h2>{post.title}</h2>
                            {post.images && post.images.length > 0 && (
                                <img
                                    className="blog-thumbnail"
                                    src={post.images[0]}
                                    alt={post.title + " thumbnail"}
                                />
                            )}
                            <small className="blog-date">
                                {post.date && new Date(post.date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </small>
                            <p>{post.excerpt}</p>
                        </button>
                    </li>
                ))}
            </ul>
            
            {showModal && selectedPost && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        <h2>{selectedPost.title}</h2>
                        <small className="blog-date">
                            {selectedPost.date && new Date(selectedPost.date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                            </small>
                            <div className="blogdetailcontent">
                                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                 {selectedPost.images && selectedPost.images.length > 0 && (
                                    <div className="blog-images">
                                        {selectedPost.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={selectedPost.title + " image " + (idx + 1)} />
                                        ))}
                                    </div>
                                    )}
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogPage;