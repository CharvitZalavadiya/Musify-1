
// playlist api na url mate 
?fields=description,external_urls,followers(total),id,images,name,owner(display_name),tracks(total,items(track(album(images,name),artists,duration_ms,name,id,uri))),type,uri










playlistTracks.forEach((item, index) => {
    const {
        track:{
            album:{
                name: albumName,
                images: albumImages
            }
        }
    } = item
    console.log(albumName)
})