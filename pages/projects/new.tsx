import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import AppHeader from '../../components/AppHeader'
import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { post } from '../../utils/http'
import { useRouter } from 'next/router'
import TagsInput from '../../components/TagsInput'
import { useWeb3 } from '../../components/Web3Provider'
import type { CreateProjectPayload } from '../api/projects'

const styles = {
	centered: {
		textAlign: 'center',
	},
	submitBtn: {
		marginTop: 2,
    color: '#fff'
	},
}


const NewProjectPage: NextPage = () => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
  const [bpm, setBpm] = useState(120)
  const [timeboxMins, setTimeboxMins] = useState(2)
	const [tags, setTags] = useState<string[]>([])
	const [successOpen, setSuccessOpen] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [errorOpen, setErrorOpen] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')
	const router = useRouter()
  const { accounts } = useWeb3()

	// Tags
	const handleAddTag = (tag: string) => setTags([...tags, tag])
	const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

	const handleSubmit = async () => {
		try {
			const payload: CreateProjectPayload = {
        createdBy: accounts[0],
        collaborators: [accounts[0]], // start as only collaborator
        name,
        description,
        bpm,
        timeboxMins,
        tags,
      }
			const res = await post('/projects', payload)
			if (res.success) {
				setSuccessOpen(true)
				setSuccessMsg('Successfully created project')
				resetForm()
				// Redirect to project page
				router.push(`/projects/${res.data._id}`)
			} else {
				setErrorOpen(true)
				setErrorMsg('An error occurred creating the project')
			}
		} catch (e) {
			console.error('Project creation failed')
		}
	}

	const resetForm = () => {
		setName('')
		setDescription('')
    setBpm(120)
    setTimeboxMins(2)
    setTags([])
	}

	const onNotificationClose = () => {
		setSuccessOpen(false)
		setSuccessMsg('')
		setErrorOpen(false)
		setErrorMsg('')
	}

	return (
		<>
			<Head>
				<title>ETHDenver Hack Web App | Create A New Project</title>
				<meta name="description" content="A hackathon music app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<AppHeader />

			<main id="app-main">
				<Container maxWidth="md" sx={styles.centered}>
					<Typography variant="h3" component="h1">
						Create A New Project
					</Typography>
					<Typography>Create a new project by filling out the details below.</Typography>
					<TextField
						label="Project Name"
						variant="filled"
						margin="normal"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="Give it a catchy name!"
						fullWidth
					/>
					<TextField
						label="Project Description"
						variant="filled"
						margin="normal"
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="Describe what your vision for this project is so that collaborators have a guiding star."
						fullWidth
					/>
          <TextField
						label="Project BPM"
						variant="filled"
						margin="normal"
            type="number"
						value={bpm}
						onChange={e => setBpm(parseInt(e.target.value))}
						placeholder="What BPM is this project targetting?"
						fullWidth
					/>
          <TextField
						label="Project Timebox (mins)"
						variant="filled"
						margin="normal"
            type="number"
						value={timeboxMins}
						onChange={e => setTimeboxMins(parseInt(e.target.value))}
						placeholder="Set a maximum limit on how long samples should be."
						fullWidth
					/>
					<TagsInput
						tags={tags}
						onAdd={tag => handleAddTag(tag)}
						onDelete={(tag: string) => handleRemoveTag(tag)}
					/>
					<Button
						variant="contained"
						color="secondary"
						size="large"
						onClick={handleSubmit}
						fullWidth
						sx={styles.submitBtn}
					>
						Create Project
					</Button>
				</Container>
			</main>

			<Footer />
			{successOpen && (
				<Notification
					open={successOpen}
					msg={successMsg}
					type="success"
					onClose={onNotificationClose}
				/>
			)}
			{errorOpen && (
				<Notification open={errorOpen} msg={errorMsg} type="error" onClose={onNotificationClose} />
			)}
		</>
	)
}

export default NewProjectPage
