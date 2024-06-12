'use client'
import {useCallback, useEffect, useRef, useState} from "react";
import MarkdownBlock from "@/components/markdown-block";
import useSWRSubscription, {SWRSubscriptionOptions} from "swr/subscription";
import {w3cwebsocket as W3CWebSocket} from "websocket";


export default function Home() {
    const [videoUrl, setVideoUrl] = useState('');
    const [audienceDescription, setAudienceDescription] = useState('');
    const [generatedMarkdown, setGeneratedMarkdown] = useState('');
    const socketRef = useRef<WebSocket | null>(null)
    const [blogPost, setBlogPost] = useState<string>("")
    const [blogTitle, setBlogTitle] = useState<string>("")
    const [blogOutline, setBlogOutline] = useState<string>("")
    const uuid = "testing"

    const sendVideoToProcess = useCallback((video_url: string, audience: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                youtube_url: video_url,
                audience,
                message: "For shits! And giggles!"
            }));
        } else {
            console.error("WebSocket is not open. Ready state: ", socketRef.current?.readyState);
        }
    }, []);

    const {
        data,
        error
    } = useSWRSubscription(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}toolkit/${uuid}/` as string, (key, {next}: SWRSubscriptionOptions<number, Error>) => {
        console.log("key", key)
        const socket = new WebSocket(key)
        socketRef.current = socket;

        socket.addEventListener('message', (event) => next(null, event.data))
        // @ts-ignore
        socket.addEventListener('error', (event) => next(event.error))
        return () => socket.close()
    })


    useEffect(() => {
        if (!data) return
        const parsedData = JSON.parse(data.toString())
        setGeneratedMarkdown("Finished Generating")
        console.log(parsedData)
        setBlogTitle(parsedData.title)
        setBlogOutline(parsedData.outline)
        setBlogPost(parsedData.post)
    }, [data])

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted")
        sendVideoToProcess(videoUrl, audienceDescription)
        // Logic to process the form and generate markdown
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
            <div className="min-h-screen bg-gray-100 flex items-center justify-center w-full">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <h1 className="text-2xl font-bold mb-4">Generate Markdown Blog</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
                                YouTube Video URL
                            </label>
                            <input
                                type="text"
                                id="videoUrl"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audienceDescription">
                                Audience Description
                            </label>
                            <textarea
                                id="audienceDescription"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={4}
                                value={audienceDescription}
                                onChange={(e) => setAudienceDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Process
                            </button>
                        </div>
                    </form>
                    {generatedMarkdown && (
                        <div className="mt-6 p-4 rounded h-full text-gray-700">
                            <h2 className="text-xl font-bold mb-2 text-gray-700">{blogTitle}</h2>
                            <pre className="text-gray-700">{blogOutline}</pre>
                            <MarkdownBlock content={blogPost}/>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
