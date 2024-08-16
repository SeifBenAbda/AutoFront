import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "../../@/components/ui/resizable"
  import { Button } from "../../@/components/ui/button"
import {useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth";

  

  const ResizableTable: React.FC = () => {
    const { handleLogout, error } = useAuth(); // Use the custom hook
    const navigate = useNavigate(); // Initialize useNavigate
    return (
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
          <Button onClick={() => {
  handleLogout(() => navigate('/dashboard')); // Pass a function to handleLogout
}}>
  Logout
</Button>
  
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Two</ResizablePanel>
        </ResizablePanelGroup>
      )
  };

  export default ResizableTable

 
  