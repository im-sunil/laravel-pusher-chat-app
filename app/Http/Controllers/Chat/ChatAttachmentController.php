<?php

namespace App\Http\Controllers\Chat;

use App\Model\Message;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;

class ChatAttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $file = $request->file("send_attachment");

        if ($file->isValid()) {
            $isImage       = $this->isImage();
            $name          = preg_replace('/\s+/', '-', $file->getClientOriginalName());
            $hashDirectory = Str::random(40);
            $key           = "documents/{$hashDirectory}/" . $name;
            $thumbnailKey  = "documents/{$hashDirectory}/" . "245-245-" . $name;
            $disk          = Storage::disk('public');
            $disk->put($key, file_get_contents($file));
            if ($isImage) {
                $thumbnail = Image::make($file->getRealPath())->fit(245, 245,
                    function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    })->encode($file->getClientOriginalExtension(), 80);
                $disk->put($thumbnailKey, $thumbnail);
            }
            $document = [
                "name"          => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                "url"           => $key,
                "thumbnail_url" => $isImage ? $thumbnailKey : null,
                "mime"          => $file->getMimeType(),
                "preview_url"   => null,
                "preview"       => null,
                "shared_id"     => Str::random(50),
                "file_size"     => $this->filesizeFormat($file->getSize()),
            ];
        }
        return Message::create([
            "user_id"  => $user->id,
            "type"     => 2,
            "document" => $document,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function filesizeFormat($size)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $power = $size > 0 ? floor(log($size, 1024)) : 0;
        return number_format($size / pow(1024, $power), 2, '.', ',') . ' ' . $units[$power];
    }
}
