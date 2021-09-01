import Image from "next/image";
import { useSession } from "next-auth/client";
import {EmojiHappyIcon} from "@heroicons/react/outline";
import {CameraIcon, VideoCameraIcon} from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { db,storage } from "../firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';





function InputBox() {
    const [session]= useSession();
    const inputRef= useRef(null);
   
   //to store the refrence to database
    const filepickerRef=useRef(null);
    const [imageToPost , setImageToPost]=useState(null); // when we select image it shows which image we selected

    const sendPost=e => {
        e.preventDefault();
        //it doesnot refresh the page after post submit

        if(!inputRef.current.value) return;//to block the post or submit if entry is empty or nothing is written in box
        
        //if there is message than with db add it to the post
        
        db.collection('posts').add({
            message:inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
            //to add time

        }).then(doc => {
            if(imageToPost){
                //upload image to the database is storage section and post code
                const uploadTask= storage.ref(`posts/${doc.id}`) .putString(imageToPost,'data_url');
                    removeImage();
                    uploadTask.on('state_change',null,error =>console.error(error),()=>{
                        //when the upload complete
                        storage.ref('posts').child(doc.id).getDownloadURL().then(url => {
                            db.collection('posts').doc(doc.id).set({
                                postImage: url
                            },{merge: true})//when we use set() we have to write merge:true otherwise it will save the image and dellete the text that we are posting it will clear complete database leaving image
                        })

                    });
            }
        });

        inputRef.current.value=""; // clear the input

        
        
    };

    const addImageToPost=(e) =>{
        const reader= new FileReader(); //to read the file
        //if user selects the file then this code will read that file as data url
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);

        }
        //And here after image  is selected and get loded it will appear here as a result
        reader.onload= (readerEvent)=>{
            setImageToPost(readerEvent.target.result)



        };
    };
     // remove the image code
    const removeImage= () =>{
        setImageToPost(null);
    }

    return (
        <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium ml-1">
            <div className="flex space-x-4 p-4 items-center">
                <Image
                className="rounded-full"
                src={session.user.image}
                width={40}
                height={40}
                layout="fixed"
                alt="input"
                />

                <form className="flex flex-1">

                    <input className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none" 
                    type="text" 
                    ref={inputRef}
                   // take ref from here
                    placeholder={`what's on your mind , ${session.user.name}`}/>

                    <button hidden type="submit" onClick={sendPost}>Submit</button>

                </form>

                {imageToPost && (
                    <div /**to remove the image on clicking the pic code */ 
                    onClick={removeImage} className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">
                        <p className="text-xs text-red-500 text-center">Remove</p>

                        <img 
                        className="h-10 object-contain"
                        src={imageToPost}
                        alt=""
                        />


                    </div>
                )}



            </div>
            <div className="flex justify-evenly p-3 border-t ">

                <div className="inputIcon">
                <VideoCameraIcon className="h-7 text-red-500"/>
            <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
     

                </div>
                  
                <div /**this will make hidden button click */ 
                onClick={() => filepickerRef.current.click()} className="inputIcon">
                <CameraIcon className="h-7 text-green-400"/>
            <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
            <input ref={filepickerRef} 
            onChange={addImageToPost} 
            type="file" 
            hidden />

                </div>

                <div className="inputIcon">
                <EmojiHappyIcon className="h-7 text-yellow-700"/>
            <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
                </div>

              


            </div>

           
            
        </div>

        
    )
}

export default InputBox;
