<script lang="ts">
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Autoplay } from 'swiper';
	import 'swiper/css/lazy';
	import 'swiper/css';
	type Notes = Note[];

	interface Note {
		id: string;
		userEmail: string;
		description: string;
		title: string;
		createdAt: string;
		updatedAt: string;
		tags: string[];
		pictures: Picture[];
	}

	interface Picture {
		userEmail: string;
		id: string;
		noteId: string;
		createdAt: string;
	}
	export let notes: Notes;
</script>

<div class="flex justify-center flex-col items-center">
	{#each notes as note}
		<a
			href="/note/{note.id}"
			class="block overflow-hidden rounded-2xl w-2/5 justify-self-center"
		>
			<div class="object-cover h-56 flex justify-center">
				<div class="flex justify-center items-center">
					<Swiper
						modules={[Autoplay]}
						centeredSlides={true}
						loop={true}
						slidesPerView="auto"
						preloadImages={false}
						autoplay={{
							delay: 2500,
							disableOnInteraction: false
						}}
					>
						{#each note.pictures as picture}
							<SwiperSlide>
								<img
									class="object-cover h-56"
									src="/api/v1/images/get?id={picture.id}"
									alt=""
								/>
							</SwiperSlide>
						{/each}
					</Swiper>
				</div>
			</div>

			<div class="p-4 bg-gray-900">
				<h5 class="text-sm text-white">{note.title}</h5>

				{#if note.description !== null}
					<p class="mt-1 text-xs text-gray-500">
						{note.description}
					</p>
				{/if}
				{#if note.tags.length !== 0}
					<div>
						{#each note.tags as tag}
							<strong
								class="border border-red-500 text-white bg-red-500 uppercase px-5 py-1.5 rounded-full text-[10px] tracking-wide"
							/>
						{/each}
					</div>
				{/if}
			</div>
		</a>
		<span class="py-4" />
	{/each}
</div>
