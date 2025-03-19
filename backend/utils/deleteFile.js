const fs = require('fs-extra'); 


const deleteFile = async (filePath) => {

  try {

    const exists = await fs.pathExists(filePath)
  
    if (exists) {
      await fs.remove(filePath) 
      console.log(`Successfully deleted file: ${filePath}`)
    } else {
      console.warn(`File not found: ${filePath}`)
    }

  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error)
    if (error.code === 'EPERM') {
      console.warn('Permission denied. Try running with elevated permissions.')
    }
  }

}



module.exports = deleteFile