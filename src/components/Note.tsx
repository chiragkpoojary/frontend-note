import React, { useState } from "react";
import { Input, Chip,Typography ,Textarea,Button} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

import { Alert } from "@material-tailwind/react";

import axios from "axios";



function TagInput({ tags, setTags,empty }: { tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>>,empty: boolean|undefined}) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
 
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };
  const AddTag=()=>{

    if (!tags.includes(inputValue.trim())&&inputValue.trim()!=="") {
      setTags([...tags, inputValue.trim()]);
    }
    setInputValue("");
    
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="relative">
      <Input
        crossOrigin={undefined}
        label="Tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="pr-20"
        disabled={empty}
      />
      <Button
        size="sm"
       onClick={()=>{AddTag()}}
        className="!absolute right-1 top-1 rounded"
      >Add</Button>
      <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Chip 
            key={index} 
            value={tag} 
            onClose={() => removeTag(tag)}
            className="bg-gray-800 text-white "
        
          />
        ))}
        
      </div>
    </div>
  );
}

 function Note() {
  const navigate=useNavigate();
  const [Title, setTitle] = useState("");
  const [Tags, setTags] = useState<string[]>([]);
  const [Discription, setDescription] = useState("");
  const [empty,setempty] = useState(false);
 


  const collectNote = async () => {
    

  const token = localStorage.getItem("jwtToken");

    if(Title.trim()===""){
      setTitle(" ");
      setTags([]);
      setDescription(" ");
     setempty(!empty);
   
    }else{
     
     // http://localhost:8080/api/creatednote
    try {

  await axios.post(
      'http://localhost:8080/api/creatednote',
      {
        title: Title,
        tags: Tags,
        description: Discription,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    

      } catch (e) {

        console.log("Error occurred while adding data to the database", e);

      }
      
           setTitle(" ");
      setTags([]);
      setDescription(" ");

      navigate("/");
     
   
     
    }
  
    
  };
function Alert1(){
  setTitle("");
      setTags([]);
      setDescription("");
      setempty(!empty)
}

  return (
    <div className="">
      <Typography variant="h1" className="flex justify-center items-center mt-4">Add Note</Typography>
      <div className="flex items-start justify-center flex-col ">
        <div className="flex items-start justify-center min-h-screen px-4 w-full gap-10 md:flex-row flex-col -mt-44 md:mt-28">
          <div className="w-full max-w-7xl md:max-w-md flex relative">
            <Input
              label="Title"
              crossOrigin={undefined}
              className="h-16 shadow-xl pr-20"
              size="lg"
              onChange={(e)=>{setTitle(e.target.value)}}
              value={Title}
              disabled={empty}
             
            />
          </div>
          <div className="w-60">  
          <TagInput tags={Tags} setTags={setTags} empty={empty}/>
          </div>
        </div>
        <div className=" w-[32rem] -mt-56 px-4 md:absolute md:top-[34rem]  2xl:ml-[23rem] ">
    
<Textarea label="Discription"   rows={10}   onChange={(e)=>{setDescription(e.target.value)}} value={Discription} disabled={empty} />
<div className="flex w-full justify-between py-1.5 " aria-disabled={!open}>
  
  <div className="flex gap-2">
    <Button size="sm" color="red" variant="text" className="rounded-md shadow-2xl" onClick={()=>{  setTitle(" ");
    setTags([]);
    setDescription(" ");}} disabled={empty}>
      Cancel
    </Button>
    <Button size="sm" className="rounded-md shadow-2xl" onClick={collectNote} disabled={empty}>
   
      Add Note
    </Button>
    </div>
  
  </div>
  <div className="bg-gray-900 mt-5 rounded-lg w-96 md:w-full">
        {
        empty&&<Alert open={empty} onClose={()=>Alert1()} color="red">
        Please fill the Title 
        </Alert>
        
   
      }
      </div>
</div>

      </div>
      
    </div>
  );
}

export default Note;























