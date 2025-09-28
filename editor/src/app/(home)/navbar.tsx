import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { EditIcon, CheckCircle, AlertCircle, User } from "lucide-react";
import { useMainWebsiteAuth } from "@/hooks/use-main-website-auth";
import { useEffect, useState } from "react";
import { UserDetailsPopup } from "@/components/user-details-popup";

export const Navbar = () => {
  const { isAuthenticated, hasError, user, errorMessage, errorType, loginMethod, clearAuth, clearError } = useMainWebsiteAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setShowSuccessMessage(true);
      console.log('🎉 Editor navbar showing success message for main website login:', {
        user: user.email,
        method: loginMethod
      });
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        console.log('✅ Editor navbar success message auto-hidden');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, loginMethod]);

  useEffect(() => {
    if (hasError && errorMessage) {
      setShowErrorMessage(true);
      console.log('🚨 Editor navbar showing error message for main website login failure:', {
        errorMessage,
        errorType
      });
      // Hide the error message after 7 seconds
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
        console.log('❌ Editor navbar error message auto-hidden');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [hasError, errorMessage, errorType]);

  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/">
          <Image src={"/logo.svg"} alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Docs</h3>
        {showSuccessMessage && (
          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully logged in using the main website</span>
            <button
              onClick={() => {
                setShowSuccessMessage(false);
                console.log('✅ Editor navbar success message manually dismissed');
              }}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        )}
        {showErrorMessage && (
          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Authentication failed on main website</span>
            <button
              onClick={() => {
                setShowErrorMessage(false);
                clearError();
                console.log('❌ Editor navbar error message manually dismissed');
              }}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <SearchInput />
      <div className="flex gap-3 items-center pl-6">
      <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <Link href="/template-editor">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <EditIcon className="size-4" />
            Template Editor
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => {
            console.log('🔍 Get My Details button clicked');
            setShowUserDetails(true);
          }}
        >
          <User className="size-4" />
          Get My Details
        </Button>
        <UserButton />
      </div>
      <UserDetailsPopup 
        isOpen={showUserDetails} 
        onClose={() => setShowUserDetails(false)} 
      />
    </nav>
  );
};
