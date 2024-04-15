const firebaseConfig = {
    apiKey: "AIzaSyDD9FrASdL_Tnh51eCDt3ITeoi2_B_Nkdk",
    authDomain: "vibras-78955.firebaseapp.com",
    projectId: "vibras-78955",
    storageBucket: "vibras-78955.appspot.com",
    messagingSenderId: "136880592779",
    appId: "1:136880592779:web:5d676abfb1a624c2dd818e"
};

firebase.initializeApp(firebaseConfig);

export const uploadFileToStorage = (reference, file, progress) => {
    return new Promise((resolve, reject) => {
        let storageRef = firebase.storage().ref(`${reference}/${file.name}`);
        let uploadTask = storageRef.put(file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progress.value = progressValue;
            },
            (error) => {
                reject(error); 
            },
            () => {
                uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    });
            }
        );
    });
};