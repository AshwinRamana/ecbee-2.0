# Run this script as Administrator to automatically add the mappings

$hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
$domains = @(
    "127.0.0.1  client1.ecbee.net",
    "127.0.0.1  client2.ecbee.net",
    "127.0.0.1  client3.ecbee.net",
    "127.0.0.1  client4.ecbee.net",
    "127.0.0.1  client5.ecbee.net"
)

$content = Get-Content $hostsFile

foreach ($entry in $domains) {
    if ($content -notcontains $entry) {
        Add-Content -Path $hostsFile -Value $entry
        Write-Host "Added: $entry"
    } else {
        Write-Host "Already exists: $entry"
    }
}

Write-Host "Host mapping complete! Please restart Chrome to ensure changes take effect."
