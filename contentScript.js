let links = Array.from(document.querySelectorAll('a[href*="tiktok."]:not(:has(.hoverable)), a[href*="youtube."]:not(:has(.hoverable)), a[href*="youtu.be"]:not(:has(.hoverable))'));

//links = document.querySelectorAll('a')


links.forEach(node => {
    addlister(node)
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            let new_nodes = Array.from(document.querySelectorAll('a[href*="tiktok."]:not(:has(.hoverable)), a[href*="youtube."]:not(:has(.hoverable)), a[href*="youtu.be"]:not(:has(.hoverable))'));

            //new_nodes = Array.from(document.querySelectorAll('a'))

            //filter out the nodes that already have a marker
            new_nodes = new_nodes.filter(node => node.getAttribute('data-hoverable') !== 'true');

            for (let node of new_nodes) {
                addmarker(node);
                addlister(node);
            }
        }
    });
});

// Start observing the document
observer.observe(document, { childList: true, subtree: true });


let div = document.createElement('div');
div.className = 'move';

document.body.appendChild(div);

let elem = document.querySelector('.mover'),
    over = false
    tt = false;


// element mousemove to stop 
document.body.addEventListener('mousemove', function (e) {
    if (over) {
        let height = div.querySelector('img')?.offsetHeight ?? 235;

        //weird bug fix
        if (height == 10)
            height = 235

        let left = e.pageX + 5
        let top = e.pageY + 15

        //left = Math.max((e.pageX - div.offsetWidth / 1.3), 10)
        //top = Math.min(e.pageY + 10, window.innerHeight - height - 10)

        if (left > window.innerWidth - div.offsetWidth - 15) {
            //right
            left = window.innerWidth - div.offsetWidth - 15
        }

        if (top > window.innerHeight - height - 15) {
            //bottom
            top = e.pageY - height - 15
        }
        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
    }
}, true);

//addOverlay()


function addlister(test) {
    test.addEventListener("mouseleave", function (event) {
        over = false;
        removeOverlay()
    }, false);
    test.addEventListener("mouseover", function (event) {
        addOverlay(test)
        over = true;
    }, false);
}

function parseLink(link) {
    //extract the video id from the link
    let videoId = link.split('v=')[1];
    //if the link is a youtu.be link, extract the video id from the link
    if (!videoId) {
        videoId = link.split('youtu.be/')[1];
    }
    if (!videoId)
        return undefined
    videoId = videoId.split('&')[0];
    videoId = videoId.split('?')[0];
    return videoId;
}

function addmarker(node) {
    //add a marker to the link to prevent it from being processed again
    node.setAttribute('data-hoverable', 'true');
}

async function addOverlay(elem) {
    let href = elem.href;
    if (href.includes('tiktok.')) {
        tt = true;
        // issue with cors policy
        let data = await fetch(`https://www.tiktok.com/oembed?url=${href}`).then((response) => response.json())
        //console.log(data)
        if (over)
            div.innerHTML = `<div> <img src="${data.thumbnail_url}" alt="Youtube Video" class=hoverimage  style="width: 200px;"> <div class="overlay-text" style="width: 170px;"> ${data.title} </div> </div>`;
    }
    else {
        tt = false;
        let videoId = parseLink(href);
        if (!videoId)
            return;
        let data = await fetch(`https://youtube.com/oembed?url=${href}&format=json`).then((response) => response.json())

        if (over)
            div.innerHTML = `<div> <img src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" alt="Description of the image" class=hoverimage> <div class="overlay-text"> ${data.title} </div> </div>`;
    }
}

function removeOverlay() {
    div.innerHTML = ""
}