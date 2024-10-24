
///  with audio 

import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Pages = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref}>
            <p>{props.children}</p>
            <p>Page number: {props.number}</p>
        </div>
    );
});

Pages.displayName = 'Pages';

function Flipbook() {
    const [numPages, setNumPages] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const audioRef = useRef(null);

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPdfFile(reader.result);
                setFileError('');
            };
        } else {
            setFileError('Please upload a valid PDF file.');
        }
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Play sound when page is flipped
    const handlePageFlip = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind to start
            audioRef.current.play();
        }
    };

    return (
        <div className='h-screen w-screen flex flex-col gap-5 items-center bg-gray-900 overflow-hidden'>
            <h1 className='text-3xl text-white text-center font-bold px-0'>FlipBook</h1>

            {/* File Upload Section */}
            <div className="file-upload">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="text-white"
                />
                {fileError && <p className="text-red-500">{fileError}</p>}
            </div>

            {/* Flipbook */}
            {pdfFile ? (
                <>
                    <audio ref={audioRef} src="/audio/flipsound.mp3" preload="auto" />
                    <HTMLFlipBook width={650} height={920} onFlip={handlePageFlip}>
                        {
                            [...Array(numPages).keys()].map((pNum) => (
                                <Pages key={pNum} number={pNum + 1}>
                                    <Document
                                        file={pdfFile}
                                        onLoadSuccess={onDocumentLoadSuccess}>
                                        <Page
                                            pageNumber={pNum} // Fix page number
                                            width={650}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                        />
                                    </Document>
                                </Pages>
                            ))
                        }
                    </HTMLFlipBook>
                </>
            ) : (
                <p className='text-white'>No PDF loaded. Please upload a PDF file to view.</p>
            )}
        </div>
    );
}

export default Flipbook;

