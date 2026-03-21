import { useEffect, useState } from "react"
import { getStudentDrives } from "../../services/studentService"
import DashboardLayout from "../../components/layout/Dashboard"
import { Drive } from "../../Types/drive"

export default function StudentDrivesPage({ onLogout }: { onLogout: () => void }) {

  const [drives,setDrives] = useState<Drive[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function fetchDrives(){
      try{

        const data = await getStudentDrives()
        setDrives(data.drives)

      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }

    fetchDrives()

  },[])

  if(loading){
    return <div className="text-white">Loading drives...</div>
  }

  return(

    <DashboardLayout onLogout={onLogout}>

    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 tracking-tight">Campus Drives</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {drives.map((drive)=>(

          <div
            key={drive.id}
            className="p-6 border border-white/[0.06] rounded-xl bg-[#0a0a0a]"
          >

            <h2 className="text-xl font-semibold">
              {drive.title}
            </h2>

            <p className="text-gray-400 mt-2">
              {drive.description}
            </p>

            <div className="text-sm text-gray-500 mt-3">
              {new Date(drive.start_time).toLocaleDateString()}
              {" - "}
              {new Date(drive.end_time).toLocaleDateString()}
            </div>

          </div>

        ))}

      </div>

    </div>

  </DashboardLayout>
  )
}