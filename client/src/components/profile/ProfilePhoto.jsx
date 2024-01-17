import React, { useState, useRef } from 'react';

const ImgUpload = ({ onChange, src, onClick }) => (
    <label htmlFor="photo-upload" className="custom-file-upload fas" onClick={onClick}>
        <div className="img-wrap img-upload">
            <img
                htmlFor="photo-upload"
                src={src}
                alt="Uploaded"
                className="max-w-xs max-h-xs rounded-full"
            />
        </div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Click to upload</label>
        <input
            className="hidden"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={onChange}
        />
    </label>
);

const ProfileImageUploader = () => {
    const [file, setFile] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
    const fileInputRef = useRef(null);

    const handlePhotoUpload = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const uploadedFile = e.target.files[0];

        reader.onloadend = () => {
            setFile(uploadedFile);
            setImagePreviewUrl(reader.result);
        };

        reader.readAsDataURL(uploadedFile);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <ImgUpload onChange={handlePhotoUpload} src={imagePreviewUrl} onClick={handleClick} />
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                onChange={handlePhotoUpload}
            />
        </div>
    );
};

export default ProfileImageUploader;
