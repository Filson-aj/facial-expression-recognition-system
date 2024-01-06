const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white py-4'>
      <div className='container mx-auto flex justify-center'>
        <div className='text-center'>
          <p className='text-sm'>&copy; {new Date().getFullYear()} Savvy-Tech</p>
          <p className='text-sm'>Contact: contact@savvytech.com</p>
          <div className='mt-4'>
            <a
              href='https://www.facebook.com/savvytech'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-200 mx-2'
            >
              Facebook
            </a>
            <a
              href='https://twitter.com/savvytech'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-200 mx-2'
            >
              Twitter
            </a>
            <a
              href='https://www.linkedin.com/company/savvytech'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-200 mx-2'
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer