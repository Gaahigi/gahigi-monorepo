# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    pkgs.nodejs_20
    pkgs.nest-cli
    pkgs.openssl.dev
  ];
  services.docker.enable = true;
  
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [ "ms-python.python" "rangav.vscode-thunder-client" ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
     
      };
    };

    workspace = {

      onCreate = {
      
      };
      
      onStart = {
       
      };
    };
  };
}
