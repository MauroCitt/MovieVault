import React, { useState } from 'react';

const ImgUpload = ({ onChange, src }) => (
    <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload">
            <img
                htmlFor="photo-upload"
                src={src}
                alt="Uploaded"
                className="max-w-xs max-h-xs rounded-full"
            />
        </div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
        <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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

    return (
        <div>
            <ImgUpload onChange={handlePhotoUpload} src={imagePreviewUrl} />
        </div>
    );
};

export default ProfileImageUploader;
