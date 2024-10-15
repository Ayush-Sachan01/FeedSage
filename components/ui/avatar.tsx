
import React from 'react';



interface AvatarProps {

  children: React.ReactNode;

}



export function Avatar({ children }: AvatarProps) {

  return <div className="avatar">{children}</div>;

}



interface AvatarImageProps {

  src: string;

  alt: string;

}



export function AvatarImage({ src, alt }: AvatarImageProps) {

  return <img className="avatar-image" src={src} alt={alt} />;

}



interface AvatarFallbackProps {

  children: React.ReactNode;

}



export function AvatarFallback({ children }: AvatarFallbackProps) {

  return <div className="avatar-fallback">{children}</div>;

}
