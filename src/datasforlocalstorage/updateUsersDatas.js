function updateUserData(userData){
    
    const stringData = localStorage.getItem("userkey") || "{}";
    let currentData = JSON.parse(stringData);

    
    for (let property in userData) {
        currentData[property] = userData[property];
    }
    
    localStorage.setItem("userkey", JSON.stringify(currentData));
}
export default updateUserData;