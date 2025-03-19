const sections = [
    {
      _id: '63d4ab4f5a8c970d3a6e3bc7',  
      name: 'Introduction to web development',
      viewCount: 120,
      views: [
        { userId: 'userId1', timestamp: new Date('2025-01-01T10:00:00Z') },
        { userId: 'userId2', timestamp: new Date('2025-01-02T10:00:00Z') }
      ],
      items: [
        {
          _id: '63d4ab4f5a8c970d3a6e3bc8',  // Example item ID
          type: 'Video',
          name: 'Setting up your Development Enviroment',
          viewCount: 55,
          type : "Activity",
          views: [
            { userId: 'userId1', timestamp: new Date('2025-01-03T10:00:00Z') },
            { userId: 'userId3', timestamp: new Date('2025-01-04T10:00:00Z') }
          ],
          attachments: [
            { fileName: 'file1.pdf', url: 'https://example.com/file1.pdf' },
            { fileName: 'file2.jpg', url: 'https://example.com/file2.jpg' }
          ],
          notes: [
            { note: 'Note 1 for Item 1', timestamp: new Date('2025-01-01T11:00:00Z') },
            { note: 'Note 2 for Item 1', timestamp: new Date('2025-01-02T11:00:00Z') }
          ],
          duration: 15  // Duration in minutes
        },
        {
          _id: '63d4ab4f5a8c970d3a6e3bc9',
          type: 'Document',
          name: 'Setting up your Development Enviroment',
          viewCount: 65,
          type : "Document",
          views: [
            { userId: 'userId2', timestamp: new Date('2025-01-05T10:00:00Z') },
            { userId: 'userId4', timestamp: new Date('2025-01-06T10:00:00Z') }
          ],
          attachments: [
            { fileName: 'file3.mp4', url: 'https://example.com/file3.mp4' },
            { fileName: 'file4.png', url: 'https://example.com/file4.png' }
          ],
          notes: [
            { note: 'Note 1 for Item 2', timestamp: new Date('2025-01-03T11:00:00Z') },
            { note: 'Note 2 for Item 2', timestamp: new Date('2025-01-04T11:00:00Z') }
          ],
          duration: 25  // Duration in minutes
        }
      ]
    },
    {
      _id: '63d4ab4f5a8c970d3a6e3bca', 
      name: 'HTML Fundamentals',
      viewCount: 80,
      views: [
        { userId: 'userId5', timestamp: new Date('2025-01-07T10:00:00Z') },
        { userId: 'userId6', timestamp: new Date('2025-01-08T10:00:00Z') }
      ],
      items: [
        {
          _id: '63d4ab4f5a8c970d3a6e3bcb',
          type: 'Video',
          name: 'Setting up your Development Enviroment',
          viewCount: 45,
          views: [
            { userId: 'userId5', timestamp: new Date('2025-01-09T10:00:00Z') },
            { userId: 'userId7', timestamp: new Date('2025-01-10T10:00:00Z') }
          ],
          attachments: [
            { fileName: 'file5.mp3', url: 'https://example.com/file5.mp3' },
            { fileName: 'file6.txt', url: 'https://example.com/file6.txt' }
          ],
          notes: [
            { note: 'Note 1 for Item 3', timestamp: new Date('2025-01-05T11:00:00Z') },
            { note: 'Note 2 for Item 3', timestamp: new Date('2025-01-06T11:00:00Z') }
          ],
          duration: 30  
        },
        {
          _id: '63d5cb4f5a8c970d3a6e3bcb',
          type: 'Image',
          name: 'Setting up your Development Enviroment',
          viewCount: 45,
          views: [
            { userId: 'userId6', timestamp: new Date('2025-01-09T10:00:00Z') },
            { userId: 'userId8', timestamp: new Date('2025-01-10T10:00:00Z') }
          ],
          attachments: [
            { fileName: 'file7.mp3', url: 'https://example.com/file5.mp3' },
            { fileName: 'file8.txt', url: 'https://example.com/file6.txt' }
          ],
          notes: [
            { note: 'Note 1 for Item 3', timestamp: new Date('2025-01-05T11:00:00Z') },
            { note: 'Note 2 for Item 3', timestamp: new Date('2025-01-06T11:00:00Z') }
          ],
          duration: 30  
        }
      ]
    }
  ]


  export default sections
  