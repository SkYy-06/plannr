import React from 'react'
import { Card, CardContent } from './ui/card'

const EventCard = ({
    event,
    onClick,
    showActions = false,
    onDelete,
    variant = "grid" ,// "grid" or "list"
    classname = "",
}) => {
    if(variant === "list"){
        return (
          <Card
            className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50 ${classname}`}
            onCLick={onClick}
          >
<CardContent>
    
</CardContent>

          </Card>
        );
    }
  return (
    <div> EventCard</div>
  )
}

export default EventCard