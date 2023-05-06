const URL = "https://jsonplaceholder.typicode.com";
const $posts = document.querySelector(".posts_list");
let currentPage = 1;
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");
const $search = document.getElementById("search");
const $post_form = document.getElementById("post_form");
const $modal_btn = document.getElementById("modal_btn");
const $modal = document.querySelector(".modal");
const $form_post_title = document.getElementById("title");
const $form_post_create = document.getElementById("form_post__create");

async function fetchPosts(page, title = "") {
    try {
        const res = await fetch(
            `${URL}/posts?userId=${page}${title ? `&title_like=${title}` : ""}`,
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

function appendPost(post) {
    const $post = document.createElement("div");

    $post.classList.add("post_item");
    $post.innerHTML = `
            <h5 class="post_item__title">${post.title}</h5>
            <p class="post_item__body">${post.body}</p>

        `;
    $posts.appendChild($post);
}

async function renderPosts(page = 1, title) {
    const posts = await fetchPosts(page, title);
    if ($posts.children.length) {
        $posts.innerHTML = "";
    }

    posts.forEach((post) => {
        appendPost(post);
    });

    const hidePagination = posts.length < 10;

    $prev.style.display = hidePagination ? "none" : "inline-block";
    $next.style.display = hidePagination ? "none" : "inline-block";
}

renderPosts(currentPage);

$prev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        renderPosts(currentPage);
    }
});

$next.addEventListener("click", () => {
    if (!$posts.children.length) {
        return;
    }
    currentPage += 1;
    renderPosts(currentPage);
});

$modal_btn.addEventListener("click", () => {
    $modal.classList.remove("close");
});

$search.addEventListener("input", (event) => {
    const value = event.target.value;

    renderPosts(1, value);
});

async function createPost(post) {
    try {
        const res = await fetch(`${URL}/posts`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                title: post.title,
                body: post.content,
                userId: 1,
            }),
        });
        const data = await res.json();
        return data;
    } catch (error) {}
}

$post_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = event.target[0].value;
    const content = event.target[1].value;

    if (!title || !content) {
        return;
    }

    const newPost = await createPost({
        title: title,
        content: content,
    });

    if (newPost) {
        $modal.classList.add("close");
        appendPost(newPost);
    }
});

$form_post_title.addEventListener("input", (event) => {
    if (event.target.value.length > 5) {
        $form_post_create.classList.remove("disabled");
    } else {
        $form_post_create.classList.add("disabled");
    }
});
