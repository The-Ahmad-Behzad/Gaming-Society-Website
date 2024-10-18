
export default function Field() {
    return (
        <>
        <div className="field">
        <label>Team Name</label>
      <input {...register("teamName", {required: "This field is required"})} placeholder="Enter your team / player name"/>
          <p>{errors.teamName?.message}</p>
        </div>        
        </>
    )
}