
import { getToken } from "@/utils/token"
import { Navigate } from "react-router-dom"

export function AuthRoute({ children }) {
    const token = getToken()
    
    // if token exists, return children component
    if (token) {
        return <>{children}</>
    } else {
        // replace mode
        return <Navigate to={"/login"} replace />
    }
}