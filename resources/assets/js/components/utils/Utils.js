function setUser(user) {
    return localStorage.setItem("activeUser", JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}

function getAuthUser() {
    return JSON.parse(window.auth.content);
}

function messagedTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    return `${hours} : ${minutes} ${ampm}`;
}

export {
	setUser,
	getUser,
	// getAuthUser,
	messagedTime
}