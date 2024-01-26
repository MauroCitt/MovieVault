import React, { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const ImgUpload = ({ onChange, src, onClick }) => (
    <label htmlFor="photo-upload" className="custom-file-upload fas" onClick={onClick}>
        <div className="img-wrap img-upload max-w-xs max-h-xs">
            <img
                htmlFor="photo-upload"
                src={src}
                alt="Uploaded"
                className="object-fill w-80 h-80 rounded-full hover-effect"
                id='photoUpload'
            />
        </div>
        <input
            className="hidden"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={onChange}
        />
    </label>
);
const ProfileImageUploader = (props) => {
    const [file, setFile] = useState('');
    const [user, setUser] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);

    let email = props.email;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/profile/getUser?email=${email}`);
                setUser(res.data.user);
                if (user) {
                    if (user.Image) {
                        props.setImage(user.Image);
                        localStorage.setItem('image', props.image);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user)
            if (user.Image) {
                props.setImage(user.Image);
            }
    }, [user]);

    if (imageChanged) {
        console.log("linea 59")
        window.location.reload();
    }
    const fileInputRef = useRef(null);

    const handlePhotoUpload = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const uploadedFile = e.target.files[0];

        reader.onloadend = () => {
            setFile(uploadedFile);
            props.setImage(reader.result);
        };

        handleImageSubmit(uploadedFile);
        reader.readAsDataURL(uploadedFile);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleImageSubmit = async (uploadedFile) => {

        const fileName = email;
        const storage = getStorage();
        const storageRef = ref(storage, `images/${fileName}`);

        await uploadBytes(storageRef, uploadedFile).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });

        getDownloadURL(storageRef).then(async (url) => {
            await axios.put(`http://localhost:4000/profile/updateUser?email=${email}&profileImage=${url}`, {
            }).then(console.log('URL: ' + url));
            props.setImage((prevImage) => url);
            setImageChanged(true);
        });
    };

    return (
        <div>
            <ImgUpload onChange={handlePhotoUpload} src={props.image} onClick={handleClick} />
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                id='photoUpload'
                onChange={handlePhotoUpload}
            />
        </div>
    );
};

export default ProfileImageUploader;