import React, { useState } from "react";
import { Input, Chip,Button} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

import { Alert } from "@material-tailwind/react";

import axios from "axios";
import ReactLoading from "react-loading";



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
      <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-2 mb-[3rem]">
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
     const [loading, setLoading] = useState<boolean>(false);


  const collectNote = async () => {
    

  const token = localStorage.getItem("jwtToken");

    if(Title.trim()===""){
      setTitle(" ");
      setTags([]);
      setDescription(" ");
     setempty(!empty);
   
    }else{
     

    try {
setLoading(true);
  const res=await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/creatednote`,
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
    setLoading(false);
  alert(res.data.message);

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
  <div className="flex flex-col items-center px-6 mt-12 w-full ">

    <input
      type="text"
      placeholder="Title"
      className="w-full max-w-4xl text-4xl font-bold outline-none border-none focus:ring-0 placeholder-gray-400 mb-2"
      value={Title}
      onChange={(e) => setTitle(e.target.value)}
      disabled={empty}
    />

    
<div className="w-full max-w-4xl mb-4 mt-2">
  <div className="max-w-sm">
    <TagInput tags={Tags} setTags={setTags} empty={empty} />
  </div>
</div>


   
    <textarea
      placeholder="Start writing your note..."
      className="w-full max-w-4xl text-lg leading-relaxed outline-none border-none focus:ring-0 placeholder-gray-400 resize-none bg-transparent h-[60vh] overflow-y-auto"
      value={Discription}
      onChange={(e) => setDescription(e.target.value)}
      disabled={empty}
    />

   
    <div className="flex gap-4 mt-6 w-full max-w-4xl h-max">
      <button
        onClick={() => {
          setTitle("");
          setTags([]);
          setDescription("");
        }}
        disabled={empty}
        className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50"
      >
        Cancel
      </button>

      <Button
        onClick={collectNote}
        disabled={loading}
        className="px-6 py-2 rounded-md bg-gray-900 text-white hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading && (
          <ReactLoading type="spin" color="#fff" height={18} width={18} />
        )}
        {loading ? "Submitting..." : "Add Note"}
      </Button>
    </div>

 
    {empty && (
      <div className="w-full max-w-4xl mt-6">
        <Alert open={empty} onClose={() => Alert1()} color="red">
          Please fill the Title
        </Alert>
      </div>
    )}
  </div>
);
 }
export default Note;























