'use server'

export async function processYoutubeVideo(youtubeUrl: string, audience: string) {
    const url = `${process.env.API_URL as string}toolkit/video_to_blog/`

    const generationResponse = await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": `Api-Key ${process.env.API_KEY}`
        },
        body: JSON.stringify({
            youtube_url: youtubeUrl,
            audience
        })

    })

}