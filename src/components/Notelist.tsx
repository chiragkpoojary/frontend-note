import { Typography, Card, Chip, Button, IconButton } from "@material-tailwind/react";
import { FaRegLightbulb } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Noteinter } from './NavSearch'; 
import axios from "axios";
import { AxiosResponse } from 'axios';
import { authState } from './authstate';
import { MdDelete } from 'react-icons/md';
import { passwordState } from './password';
import { MdOutlineContentCopy } from "react-icons/md";
const noteState = atom<Noteinter[]>({
  key: 'noteState',
  default: [],
});

export const NoteCard = ({ note }: { note: any}) => {
   const token = localStorage.getItem("jwtToken");
  const [, setBoxes] = useRecoilState(noteState);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;
  let notesPerPage=4;
  const [currentPage, setCurrentPage] = useState(1);
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
    axios.delete(`http://localhost:8080/api/perdelete/${note._id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    })
      .then(result => {
        if (result) {
          alert('Note deleted successfully');
          axios.get(`http://localhost:8080/api/showdata?page=${currentPage}&limit=${notesPerPage}`,{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      },).then((res: AxiosResponse) => {
            const notes = res.data.note;

            if (Array.isArray(notes)) {
              setBoxes(notes);
            } else {
              console.error("Expected reversedNotes to be an array, got:", notes);
              setBoxes([]); // Fallback to avoid slice crash
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
        <MdOutlineContentCopy className="cursor-pointer" size={20} />
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
            {isExpanded ? note.description : truncateText(note.description, maxLength)}
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
        {token && (
          <IconButton
            className=" text-red-500 bg-white mt-3"
            onClick={handleDelete}
          >
            <MdDelete size={24} />
          </IconButton>
        )}
      </div>
    </Card>
  );
};

function NotesList() {
     const token = localStorage.getItem("jwtToken");
  const [boxes, setBoxes] = useRecoilState(noteState);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6; // Adjust this number for how many notes per page

  useEffect(() => {
    axios.get(`http://localhost:8080/api/showdata?page=${currentPage}&limit=${notesPerPage}`,{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      },)
      .then((res: AxiosResponse) => {
        setBoxes(res.data.note);

      })
      .catch((e) => {
        console.log("Error while fetching", e);
      });
  }, []);

  // Get the current notes for the page
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = Array.isArray(boxes)
      ? boxes.slice(indexOfFirstNote, indexOfLastNote)
      : [];



  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {boxes.length === 0 ? (
        <div className="flex flex-col !justify-center !items-center">
          <FaRegLightbulb size={300} className="text-gray-300" />
          <Typography variant="h2" className="text-gray-400 mt-4">
            Notes you add appear here
          </Typography>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16'>
            {currentNotes.map((note, index) => (
              <div key={index} className="flex justify-center items-center">
                <NoteCard note={note}  />
              </div>
            ))}
          </div>

       
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              className="text-gray-500"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="gradient"
            >
              &lt;
            </Button>
            <Button
              className="text-gray-500"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastNote >= boxes.length}
              variant="gradient"
            >
                 &gt;
            </Button>
          </div>
          <Typography className="text-center mt-2 text-gray-900 font-semibold">
            Page {currentPage} of {Math.ceil(boxes.length / notesPerPage)}
          </Typography>
        </>
      )}
    </div>
  );
}

export default NotesList;
export { noteState };
