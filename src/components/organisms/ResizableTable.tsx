import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "../../@/components/ui/resizable"
  import { Button } from "../../@/components/ui/button"
import { Link } from "react-router-dom"
  export default function ResizableTable() {
    return (
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
        <Button>
            HELOOO
  <Link to={"/login"}>Login</Link>
</Button>

        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  