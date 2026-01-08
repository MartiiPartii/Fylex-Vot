"use client"

import { Button, Card, Stack, Typography } from "@mui/material"
import { useDropzone } from "react-dropzone"
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Loader from "~/components/Loader/Loader";
import { useFileUpload } from "~/client/state/UploadFile";
import { Twemoji } from 'react-emoji-render';

const UploadFile = () => {
    const { loading, error, onDropAccepted, onDropRejected } = useFileUpload()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        onDropRejected,
        maxFiles: 1,
        maxSize: (process.env.NEXT_PUBLIC_MAX_FILE_SIZE ? Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) : 10) * 1000000 // Convert MB to bytes
    })

    return (
        <>
            {loading && <Loader />}

            {error && <Typography variant="body1" mt={1} color="error">{error}</Typography>}

            <Card sx={{ padding: { xs: 2, sm: 4 }, mt: 4 }}>
                <Stack
                    justifyContent={"center"}
                    alignItems="center"
                    sx={{
                        border: `dashed 2px`,
                        borderColor: "border.main",
                        borderRadius: 1,
                        padding: { xs: 2, sm: 6 },
                        textAlign: "center",
                        transition: ".2s",
                        "&:hover": {
                            borderColor: "neutral.main"
                        }
                    }}
                    {...getRootProps()}
                >
                    <FileUploadOutlinedIcon sx={{ width: "3.5rem", height: "3.5rem", color: "border.secondary" }} />
                    <Typography variant="h5" mt={2} mb={1}><Twemoji text="Upload Document 📄" /></Typography>
                    <Typography variant="body1" mb={2}>Select a document to analyze for security threats and vulnerabilities</Typography>
                    {
                        isDragActive ?
                            <Typography variant="body2" mt={3}>Drop files here...</Typography>
                            :
                            <>
                                <Button variant="contained" color="primary"><Twemoji text="Browse File 🗂️" /></Button>
                                <Typography variant="body2" mt={3}>Supports PDF, DOC, DOCX, TXT, XLSX, PPTX, ODT, HTML files</Typography>
                            </>
                    }

                    <input {...getInputProps()} id="input" type="file" accept=".pdf, .doc, .docx, .txt, .xlsx, .pptx, .odt, .html" hidden />
                </Stack>
            </Card>
        </>
    )
}

export default UploadFile