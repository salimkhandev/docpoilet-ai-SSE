// import Documents from '../components/Editor/Documents' 
import ChatInterface from '../components/ai/ChatInterface'
import AuthWrapper from '../components/auth/AuthWrapper'
import Editor from '../components/Editor/Editor'


function page() {
  return (
    <AuthWrapper>
        <ChatInterface/>
        <Editor/>
        {/* <Documents/> */}
    </AuthWrapper>
  )
}

export default page
