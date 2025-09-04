import {Typography, Card, Chip, Button, IconButton} from "@material-tailwind/react";
import {FaRegLightbulb} from "react-icons/fa6";
import {useState, useEffect} from 'react';
import { useRecoilState} from 'recoil';
import Pagination from "./pagination.tsx";
import axios from "axios";
import {AxiosResponse} from 'axios';

import {MdDelete} from 'react-icons/md';

import {MdOutlineContentCopy} from "react-icons/md";
import {noteState} from "../utils/recolNote.ts";



export const NoteCard = ({note}: { note: any }) => {
    const token = localStorage.getItem("jwtToken");
    const [, setBoxes] = useRecoilState(noteState);
    const [isExpanded, setIsExpanded] = useState(false);
 

    const maxLength = 25;
    const notesPerPage = 6;
    const [currentPage,] = useState(1);

    const truncateText = (text: string, length: number) => {
        if (text.length <= length) return text;
        return text.substr(0, length) + '...';
    };
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(note.description);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text", error);
        }
    };
    const handleDelete = () => {
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/perdelete/${note._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(result => {
                if (result) {
                    alert('Note deleted successfully');
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/showdata?page=${currentPage}&limit=${notesPerPage}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },).then((res: AxiosResponse) => {

                        const notes = res.data.note;

                        if (Array.isArray(notes)) {
                            setBoxes(notes);
                        } else {
                            console.error("Expected reversedNotes to be an array, got:", notes);
                            setBoxes([]);
                        }
                    })
                } else {
                    alert('Failed to delete note');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Card
            className={`shadow-2xl p-5 w-full max-w-sm xl:max-w-full overflow-hidden h-fit relative bg-gray-300 rounded-md border-gray-200 m-5`}
        >
            <div className="flex justify-end items-end">
                <button onClick={copyToClipboard} className="flex items-center space-x-1">
                    <MdOutlineContentCopy className="cursor-pointer" size={20}/>
                    {copied && <span className="text-sm text-green-500">Copied!</span>}
                </button>
            </div>
            <div className='flex flex-col'>

                <Typography variant="h5" className="pb-3 font-bold break-all">{note.title} </Typography>
                <div className='flex flex-wrap mb-3'>
                    {note.tags.map((tag: string, index: number) => (
                        <Chip
                            key={index}
                            className="bg-gray-800 text-white text-xs mb-1 mr-1 break-all"
                            value={tag}
                        />
                    ))}
                </div>
                 <div className="overflow-x-auto">
                    <Typography color="blue-gray" className="mb-2 break-all whitespace-pre-wrap">
                       {truncateText(note.description, maxLength)}
                    </Typography>
                </div> 
                {note.description.length > maxLength && (
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500 hover:text-blue-700 text-sm mt-2 self-start"
                        color="white"
                    >
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </Button>
                )}
{isExpanded && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
      
    <button onClick={copyToClipboard} className="absolute top-6 right-14">
                    <MdOutlineContentCopy className="cursor-pointer" size={20}/>
                    {copied && <span className="text-sm text-green-500">Copied!</span>}
                </button>
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4 text-red-600 hover:text-gray-900 text-2xl font-bold"
      >
        X
      </button>


      <h2 className="text-2xl font-bold mb-4">{note.title}</h2>

     
      <div className="flex flex-wrap mb-3">
        {note.tags.map((tag: string, index: number) => (
          <Chip
            key={index}
            className="bg-gray-800 text-white text-xs mb-1 mr-1"
            value={tag}
          />
        ))}
      </div>

    
      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {note.description}
      </p>
    </div>
  </div>
)}


                {token && (
                    <IconButton
                        className=" text-red-500 bg-white mt-3"
                        onClick={handleDelete}
                    >
                        <MdDelete size={24}/>
                    </IconButton>
                )}
            </div>
        </Card>
    );
};



function NotesList() {
    const token = localStorage.getItem("jwtToken");
    const [boxes, setBoxes] = useRecoilState(noteState);
    const [totalPage, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 6; 
    const [lastChecked, setLastChecked] = useState(new Date().toISOString());
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/showdata?page=${currentPage}&limit=${notesPerPage}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },)
            .then((res: AxiosResponse) => {
                setBoxes(res.data.note);
                setTotalPages(Math.ceil(res.data.total / 6));
            })
            .catch((e) => {
                console.log("Error while fetching", e);
            });
    }, [currentPage]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/polling`,
                    { params: { since: lastChecked } }
                );

                const newNotes = res.data;

                if (newNotes.length > 0)
                    setBoxes(prev => {
                        const existingIds = new Set(prev.map(note => note._id));
                        const uniqueNewNotes = newNotes.filter((note: { _id: string; }) => !existingIds.has(note._id));
                        return [...uniqueNewNotes, ...prev];
                    });


                    const latestTime = newNotes[newNotes.length-1].updatedAt;
                    setLastChecked(latestTime);
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    console.log(lastChecked);

    return (
        <div>
            {boxes.length === 0 ? (
                <div className="flex flex-col !justify-center !items-center">
                    <FaRegLightbulb size={300} className="text-gray-300"/>
                    <Typography variant="h2" className="text-gray-400 mt-4">
                        Notes you add appear here
                    </Typography>
                </div>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16'>
                        {boxes.map((note, index) => (
                            <div key={index} className="flex justify-center items-center">
                                <NoteCard note={note}/>
                            </div>
                        ))}
                    </div>


                    <div className="flex justify-center space-x-2 mt-4">

                    <Pagination
      currentPage={currentPage}
      totalPages={totalPage}
      onPageChange={(page) => setCurrentPage(page)}
    />
                    </div>
                    <Typography className="text-center mt-2 text-gray-900 font-semibold">
                        Page {currentPage}/{totalPage}
                    </Typography>
                </>
            )}
        </div>
    );
}

export default NotesList;

