import React from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';

const UploadedFiles = ({ uploadedFiles, fetchFiles, fetchActivityLogs }) => {

  const handleFileDownload = async (fileId, fileType) => {
    try {
      const response = await axios.get(`http://localhost:8000/download/${fileId}/${fileType}`, {
        responseType: 'blob'
      });

      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'file';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      fetchFiles();
      fetchActivityLogs();
    }
    catch (error) {
      console.error('Error downloading file:', error)
    }
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>SN</th>
            <th>File Name</th>
            <th>File Extension</th>
            <th>File Size (in bytes)</th>
            <th>Number of Downloads</th>
            <th>Download File</th>
          </tr>
        </thead>
        <tbody>
          {
            uploadedFiles.map((file, index) => (
              <tr key={file._id}>
                <td>{index + 1}</td>
                <td>{file.filename}</td>
                <td>{file.file_extension}</td>
                <td>{file.file_size}</td>
                <td>{file.download_count}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="danger" className="me-2" onClick={() => handleFileDownload(file._id, 'pdf')} title='Download as PDF'>
                      <i className="bi bi-file-pdf" style={{ fontSize: '20px' }}></i>
                    </Button>

                    <Button variant="primary" onClick={() => handleFileDownload(file._id, 'docx')} title='Download as DOCX'>
                      <i className="bi bi-filetype-docx" style={{ fontSize: '20px' }}>
                      </i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
};

export default UploadedFiles;
